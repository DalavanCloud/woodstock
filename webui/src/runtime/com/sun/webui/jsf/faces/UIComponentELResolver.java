/*
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2007-2018 Oracle and/or its affiliates. All rights reserved.
 *
 * The contents of this file are subject to the terms of either the GNU
 * General Public License Version 2 only ("GPL") or the Common Development
 * and Distribution License("CDDL") (collectively, the "License").  You
 * may not use this file except in compliance with the License.  You can
 * obtain a copy of the License at
 * https://oss.oracle.com/licenses/CDDL+GPL-1.1
 * or LICENSE.txt.  See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * When distributing the software, include this License Header Notice in each
 * file and include the License file at LICENSE.txt.
 *
 * GPL Classpath Exception:
 * Oracle designates this particular file as subject to the "Classpath"
 * exception as provided by Oracle in the GPL Version 2 section of the License
 * file that accompanied this code.
 *
 * Modifications:
 * If applicable, add the following below the License Header, with the fields
 * enclosed by brackets [] replaced by your own identifying information:
 * "Portions Copyright [year] [name of copyright owner]"
 *
 * Contributor(s):
 * If you wish your version of this file to be governed by only the CDDL or
 * only the GPL Version 2, indicate your decision by adding "[Contributor]
 * elects to include this software in this distribution under the [CDDL or GPL
 * Version 2] license."  If you don't indicate a single choice of license, a
 * recipient has the option to distribute your version of this file under
 * either the CDDL, the GPL Version 2 or to extend the choice of license to
 * its licensees as provided above.  However, if you add GPL Version 2 code
 * and therefore, elected the GPL Version 2 license, then the option applies
 * only if the new code is made subject to such option by the copyright
 * holder.
 */

package com.sun.webui.jsf.faces;

import com.sun.faces.annotation.Resolver;
import com.sun.webui.jsf.util.LogUtil;
import java.util.List;
import java.util.ArrayList;
import javax.faces.component.UIComponent;
import javax.el.ELResolver;
import javax.el.ELContext;
import java.util.Iterator;
import java.beans.FeatureDescriptor;
import java.util.Arrays;

/**
 * <p>Custom <code>ELResolver that, when the <code>base</code>
 * object is a <code>UIComponent</code>, scans for a child with the
 * <code>id</code> specified by the property name.</p>
 */
@Resolver
public class UIComponentELResolver extends ELResolver {


    // -------------------------------------------------------- Static Variables
    // ------------------------------------------------------ Instance Variables
    // ------------------------------------------------------------ Constructors
    // ------------------------------------------------ ELResolver Methods
    /**
     * <p>When the base object is a <code>UIComponent</code>, treat the
     * property name as the <code>id</code> of a child component to be
     * returned.  If there is no such child, return without calling 
     * <code>context.setPropertyResolved(true)</code>.</p>
     *
     * @param context the ELContext
     * @param base Base object
     * @param property Property name
     */
    public Object getValue(ELContext context, Object base, Object property) {

        log("getValue(ctx, " + base + "," + property + ")");

        if (context == null) {
            throw new NullPointerException();
        }

        if ((base == null) || (!(base instanceof UIComponent)) ||
                (property == null)) {
            log("argument is null or not of applicable type. returning");
            return null;
        }

        // Try to resolve to facet or child UIComponent
        UIComponent component = (UIComponent) base;
        String id = property.toString();

        // First check for a facet w/ that name
        UIComponent kid = (UIComponent) component.getFacets().get(id);
        if (kid != null) {
            context.setPropertyResolved(true);
            log("returning facet " + kid);
            return kid;
        }

        // Now check for child component w/ that id
        if (component.getChildCount() < 1) {
            log("child count less than 1. returning");
            return null;
        }
        List kids = component.getChildren();
        for (int i = 0; i < kids.size(); i++) {
            kid = (UIComponent) kids.get(i);
            if (id.equals(kid.getId())) {
                context.setPropertyResolved(true);
                log("returning child " + kid);
                return kid;
            }
        }

        // Not found
        log("can't resolve. returning");
        return null;
    }

    /**
     * <p>When the base object is a <code>UIComponent</code>, treat the
     * property name as the <code>id</code> of a child component to be
     * replaced.  If there is no such child, return without calling 
     * <code>context.setPropertyResolved(true)</code>.</p>
     *
     * @param context the ELContext
     * @param base Base object
     * @param property Property name
     * @param value Replacement component
     */
    public void setValue(ELContext context, Object base, Object property, Object value) {

        log("setValue(ctx, " + base + "," + property + "," + value + ")");

        if (context == null) {
            throw new NullPointerException();
        }

        if ((base == null) || (!(base instanceof UIComponent)) ||
                (property == null) ||
                (value == null) || (!(value instanceof UIComponent))) {
            log("argument is null or not of applicable type. returning");
            return;
        }

        UIComponent component = (UIComponent) base;
        String id = property.toString();
        // First check to for facet w/ this name
        if (component.getFacets().get(id) != null) {
            component.getFacets().put(id, (UIComponent) value);
            context.setPropertyResolved(true);
            log("set facet");
            return;
        }
        // Not a facet, see if it's a child
        if (component.getChildCount() < 1) {
            log("child count less than 1. returning");
            return;
        }
        List kids = component.getChildren();
        for (int i = 0; i < kids.size(); i++) {
            UIComponent kid = (UIComponent) kids.get(i);
            if (id.equals(kid.getId())) {
                kids.set(i, value);
                context.setPropertyResolved(true);
                log("set child");
                return;
            }
        }

        log("can't resolve. returning");
    }

    /**
     * <p>When the base object is a <code>UIComponent</code>, treat the
     * property name as the <code>id</code> of a child component to be
     * retrieved.  If the specified child actually exists, return
     * <code>false</code> (because replacement is allowed).  If there
     * is no such child, , return without calling 
     * <code>context.setPropertyResolved(true)</code>.</p>
     *
     * @param context the ELContext
     * @param base Base object
     * @param property Property name
     */
    public boolean isReadOnly(ELContext context, Object base, Object property) {

        log("isReadOnly(ctx, " + base + "," + property + ")");

        if (context == null) {
            throw new NullPointerException();
        }

        if ((base == null) || (!(base instanceof UIComponent)) ||
                (property == null)) {
            log("argument is null or not of applicable type. returning");
            return false;
        }

        UIComponent component = (UIComponent) base;
        String id = property.toString();
        if (component.getFacets().get(id) != null) {
            context.setPropertyResolved(true);
            log("not read-only. found facet");
            return false;
        }
        if (component.getChildCount() < 1) {
            log("child count less than 1. returning");
            return false;
        }
        List kids = component.getChildren();
        for (int i = 0; i < kids.size(); i++) {
            UIComponent kid = (UIComponent) kids.get(i);
            if (id.equals(kid.getId())) {
                context.setPropertyResolved(true);
                log("not read-only. found child");
                return false;
            }
        }

        log("can't resolve. returning");
        return false;

    }

    /**
     * <p>When the base object is a <code>UIComponent</code>, treat the
     * property name as the <code>id</code> of a child component to be
     * retrieved.  If the specified child actually exists, return
     * <code>javax.faces.component.UIComponent</code>.  If there is
     * no such child, return without calling 
     * <code>context.setPropertyResolved(true)</code>.</p>
     *
     * @param context the ELContext
     * @param base Base object
     * @param property Property name
     */
    public Class getType(ELContext context, Object base, Object property) {

        log("getType(ctx, " + base + "," + property + ")");

        if (context == null) {
            throw new NullPointerException();
        }

        if ((base == null) || (!(base instanceof UIComponent)) ||
                (property == null)) {
            log("argument is null or not of applicable type. returning");
            return null;
        }

        UIComponent component = (UIComponent) base;
        String id = property.toString();
        if (component.getFacets().get(id) != null) {
            context.setPropertyResolved(true);
            log("found facet. returning UIComponent.class");
            return UIComponent.class;
        }
        if (component.getChildCount() < 1) {
            log("child count less than 1. returning");
            return null;
        }
        List kids = component.getChildren();
        for (int i = 0; i < kids.size(); i++) {
            UIComponent kid = (UIComponent) kids.get(i);
            if (id.equals(kid.getId())) {
                context.setPropertyResolved(true);
                log("found child. returning UIComponent.class");
                return UIComponent.class;
            }
        }

        log("can't resolve. returning");
        return null;
    }

    private void log(String message) {
        if (LogUtil.finestEnabled(UIComponentELResolver.class)) {
            LogUtil.finest(UIComponentELResolver.class, message);
        }
    }

    /**
     * <p>When the base object is a <code>UIComponent</code>, return
     * an <code>Iterator</code> of <code>FeatureDescriptor</code> objects
     * containing the component ids of the base's children and facets. If
     * the base is <code>null</code>, return an empty <code>Iterator</code>.
     * Otherwise, if the base is not a <code>UIComponent</code>, return
     * <code>null</code>.
     *
     * @param context the ELContext
     * @param base Base object
     */
    public Iterator<FeatureDescriptor> getFeatureDescriptors(ELContext context, Object base) {

        log("getFeatureDescriptors(ctx, " + base + ")");

        if (context == null) {
            throw new NullPointerException();
        }

        if (base == null) {
            return Arrays.asList(new FeatureDescriptor[0]).iterator();
        }

        if (!(base instanceof UIComponent)) {
            return null;
        }

        List<FeatureDescriptor> result = new ArrayList<FeatureDescriptor>();

        UIComponent baseUic = (UIComponent) base;
        Iterator<UIComponent> facetsAndChildren = baseUic.getFacetsAndChildren();
        while (facetsAndChildren.hasNext()) {
            UIComponent kid = facetsAndChildren.next();
            FeatureDescriptor desc = new FeatureDescriptor();
            String kidId = kid.getId();
            desc.setName(kidId);
            desc.setDisplayName(kidId);
            desc.setValue(ELResolver.TYPE, String.class);
            desc.setValue(ELResolver.RESOLVABLE_AT_DESIGN_TIME, true);
            result.add(desc);
        }

        return result.iterator();
    }

    /**
     * <p>When the base object is a <code>UIComponent</code>, return
     * <code>String.class</code>. If
     * the base is <code>null</code> or not a <code>UIComponent</code>, return
     * <code>null</code>.
     *
     * @param context the ELContext
     * @param base Base object
     */
    public Class getCommonPropertyType(ELContext context,
            Object base) {
        log("getCommonPropertyType(ctx, " + base + ")");

        if (context == null) {
            throw new NullPointerException();
        }

        if (!(base instanceof UIComponent)) {
            return null;
        }

        return String.class;
    }
}
