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

package com.sun.webui.jsf.renderkit.html;

import com.sun.webui.jsf.component.Selector;
import java.io.IOException;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import javax.faces.el.ValueBinding;
import javax.faces.render.Renderer;

/**
 * A delegating renderer base class for {@link com.sun.webui.jsf.component.CheckboxGroup}
 * and {@link com.sun.webui.jsf.component.RadioButtonGroup}. If component's items
 * property is not bound, outputs a minimal block of markup so that the component
 * can be manipulated on the design surface.
 *
 * @author gjmurphy
 */
public abstract class RbCbGroupDesignTimeRenderer extends SelectorDesignTimeRenderer {
    
    String label;
    
    /** Creates a new instance of RbCbGroupDesignTimeRenderer */
    public RbCbGroupDesignTimeRenderer(Renderer renderer, String label) {
        super(renderer);
        this.label = label;
    }

    public void encodeBegin(FacesContext context, UIComponent component) throws IOException {
        if (component instanceof Selector) {
            Selector selector = (Selector) component;
            ValueBinding itemsBinding = selector.getValueBinding("items");
            if (itemsBinding == null) {
                ResponseWriter writer = context.getResponseWriter();
                writer.startElement("div", component);
                String style = selector.getStyle();
                writer.writeAttribute("style", style, "style");
                writer.startElement("span", component);
                writer.writeAttribute("class", super.UNINITITIALIZED_STYLE_CLASS, "class");
                char[] chars = label.toCharArray();
                writer.writeText(chars, 0, chars.length);
                writer.endElement("span");
                writer.endElement("div");
            }
        }
        super.encodeBegin(context, component);
    }
    
}
