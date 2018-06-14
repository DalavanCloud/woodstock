<jsp:root version="2.0"
          xmlns:f="http://java.sun.com/jsf/core" 
          xmlns:h="http://java.sun.com/jsf/html" 
          xmlns:jsp="http://java.sun.com/JSP/Page" 
          xmlns:webuijsf="http://www.sun.com/webui/webuijsf">
          
<jsp:directive.page contentType="text/html" /> 
                    
<!-- Page Title Example -->
<f:view>
    <!--
      DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.

	  Copyright (c) 2007-2018 Oracle and/or its affiliates. All rights reserved.

	  The contents of this file are subject to the terms of either the GNU
	  General Public License Version 2 only ("GPL") or the Common Development
	  and Distribution License("CDDL") (collectively, the "License").  You
	  may not use this file except in compliance with the License.  You can
	  obtain a copy of the License at
	  https://oss.oracle.com/licenses/CDDL+GPL-1.1
	  or LICENSE.txt.  See the License for the specific
	  language governing permissions and limitations under the License.

	  When distributing the software, include this License Header Notice in each
	  file and include the License file at LICENSE.txt.

	  GPL Classpath Exception:
	  Oracle designates this particular file as subject to the "Classpath"
	  exception as provided by Oracle in the GPL Version 2 section of the License
	  file that accompanied this code.

	  Modifications:
	  If applicable, add the following below the License Header, with the fields
	  enclosed by brackets [] replaced by your own identifying information:
	  "Portions Copyright [year] [name of copyright owner]"

	  Contributor(s):
	  If you wish your version of this file to be governed by only the CDDL or
	  only the GPL Version 2, indicate your decision by adding "[Contributor]
	  elects to include this software in this distribution under the [CDDL or GPL
	  Version 2] license."  If you don't indicate a single choice of license, a
	  recipient has the option to distribute your version of this file under
	  either the CDDL, the GPL Version 2 or to extend the choice of license to
	  its licensees as provided above.  However, if you add GPL Version 2 code
	  and therefore, elected the GPL Version 2 license, then the option applies
	  only if the new code is made subject to such option by the copyright
	  holder.
    -->
  <webuijsf:page id="page1" >
    <webuijsf:html id="html1" >
      <f:loadBundle basename="com.sun.webui.jsf.example.resources.Resources" var="msgs" />
        <webuijsf:head id="head1" title="#{msgs.pagetitle_title}">
          <webuijsf:link rel="shortcut icon" url="/images/favicon.ico" type="image/x-icon" />
        </webuijsf:head>
        <webuijsf:body id="body1" >
            <webuijsf:form id="form1">
            
              <!-- Masthead -->
              <webuijsf:masthead id="masthead" serverInfo="test_server" userInfo="test_user" 
                           productImageURL="/images/example_primary_masthead.png" 
                           productImageDescription="#{msgs.mastheadAltText}"/>
                           
              <!-- Breadcrumbs -->             
              <webuijsf:breadcrumbs id="breadcrumbs">
                <webuijsf:hyperlink id="hyp1" actionExpression="#{PagetitleBean.showIndex}" text="#{msgs.exampleTitle}"
                              toolTip="#{msgs.index_title}" immediate="true"
                              onMouseOver="javascript:window.status='#{msgs.index_breadcrumbMouseOver}'; return true"
                              onMouseOut="javascript:window.status=''; return true"/>
                <webuijsf:hyperlink id="hyp2" text="#{msgs.pagetitle_title}"/>
              </webuijsf:breadcrumbs>
              
              <!-- Alerts -->
             <webuijsf:alert id="message" type="information" rendered="#{PagetitleBean.isRendered}"
                       summary="#{PagetitleBean.message}" detail="#{PagetitleBean.detail}" />
                        
             <webuijsf:alert id="error" type="error" rendered="#{PagetitleBean.errorsOnPage}"
                       summary="#{PagetitleBean.message}" detail="#{PagetitleBean.detail}"> 
             </webuijsf:alert>
              
              <!-- Page Title -->
              <webuijsf:contentPageTitle id="pagetitle" title="#{msgs.pagetitle_title}" helpText="#{msgs.pagetitle_helpText}">
                <!-- Page Buttons Top -->
                <f:facet name="pageButtonsTop">
                  <webuijsf:panelGroup id="pageButtonsGroupTop"> 
                    <webuijsf:button id="save1" text="#{msgs.pagetitle_save}" primary="true" actionExpression="#{PagetitleBean.saveClicked}" /> 
                    <webuijsf:button id="reset1" text="#{msgs.pagetitle_reset}" 
                               immediate="true" actionListenerExpression="#{PagetitleBean.resetClicked}" />
                  </webuijsf:panelGroup> 
                </f:facet> 
                <!-- Page Buttons Bottom -->
                <f:facet name="pageButtonsBottom">
                  <webuijsf:panelGroup id="pageButtonsGroupBottom"> 
                    <webuijsf:button id="save2" text="#{msgs.pagetitle_save}" primary="true" actionExpression="#{PagetitleBean.saveClicked}" /> 
                    <webuijsf:button id="reset2" text="#{msgs.pagetitle_reset}"  
                               immediate="true" actionListenerExpression="#{PagetitleBean.resetClicked}" />
                  </webuijsf:panelGroup> 
                </f:facet> 
                <!-- Page Actions -->
                <f:facet name="pageActions">
                  <webuijsf:hyperlink id="hyperlink1" text="#{msgs.pagetitle_hyperlink}" url="http://www.sun.com"
                                toolTip="#{msgs.pagetitle_hyperlinkToolTip}" immediate="true" />
                </f:facet> 
                <!-- Page Views DropDown -->
                <f:facet name="pageViews">
                  <webuijsf:dropDown id="dropdown" label="#{msgs.pagetitle_dropDown}" items="#{PagetitleBean.views}"
                               actionListenerExpression="#{PagetitleBean.menuChanged}" selected="#{PagetitleBean.selectedItem}" 
                               submitForm="true" immediate="true" />                              
                </f:facet>              
                
                <!-- Text fields -->
                <f:verbatim><![CDATA[<br/><table><tr><td>&nbsp;&nbsp;]]></f:verbatim>
                <webuijsf:label id="label1" for="text1" text="#{msgs.pagetitle_label1}" />
                <f:verbatim><![CDATA[</td><td>&nbsp;&nbsp;&nbsp;&nbsp;]]></f:verbatim>
                <webuijsf:textField id="text1" required="true" text="#{PagetitleBean.text1}"/>
                
                <f:verbatim><![CDATA[</tr><tr><td>&nbsp;&nbsp;]]></f:verbatim> 
                <webuijsf:label id="label2" for="text2" text="#{msgs.pagetitle_label2}" />
                <f:verbatim><![CDATA[</td><td>&nbsp;&nbsp;&nbsp;&nbsp;]]></f:verbatim> 
                <webuijsf:textField id="text2" text="#{PagetitleBean.text2}"/>
                <f:verbatim><![CDATA[</td></tr></table>]]></f:verbatim>
                
              </webuijsf:contentPageTitle>                                         
            </webuijsf:form>
          </webuijsf:body>
    </webuijsf:html>
  </webuijsf:page>
</f:view>
</jsp:root>
