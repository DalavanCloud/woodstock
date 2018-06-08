<%--

    DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.

    Copyright (c) 2018 Oracle and/or its affiliates. All rights reserved.

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

--%>

<jsp:root version="2.0" xmlns:f="http://java.sun.com/jsf/core" xmlns:h="http://java.sun.com/jsf/html" xmlns:jsp="http://java.sun.com/JSP/Page" xmlns:webuijsf="http://www.sun.com/webui/webuijsf">
  <jsp:directive.page contentType="text/html" />
  <f:view>
    <!--
      The contents of this file are subject to the terms
      of the Common Development and Distribution License
      (the License).  You may not use this file except in
      compliance with the License.
      
      You can obtain a copy of the license at
      https://woodstock.dev.java.net/public/CDDLv1.0.html.
      See the License for the specific language governing
      permissions and limitations under the License.
      
      When distributing Covered Code, include this CDDL
      Header Notice in each file and include the License file
      at https://woodstock.dev.java.net/public/CDDLv1.0.html.
      If applicable, add the following below the CDDL Header,
      with the fields enclosed by brackets [] replaced by
      you own identifying information:
      "Portions Copyrighted [year] [name of copyright owner]"
      
      Copyright 2007 Sun Microsystems, Inc. All rights reserved.
    -->
    <webuijsf:page >
      <webuijsf:html>
        <f:loadBundle basename="com.sun.webui.jsf.example.resources.Resources" var="msgs" />
        <webuijsf:head title="#{msgs.label_title}">
 	  <webuijsf:link rel="shortcut icon" url="/images/favicon.ico" type="image/x-icon" />
        </webuijsf:head>
        <webuijsf:body>
          <webuijsf:form id="form1">

            <!-- Masthead -->
            <webuijsf:masthead id="Masthead" productImageURL="/images/example_primary_masthead.png"
              productImageDescription="#{msgs.mastheadAltText}" 
              userInfo="test_user"
              serverInfo="test_server" />     
                         
            <!-- Bread Crumb Component -->
            <webuijsf:breadcrumbs id="breadcrumbs">
              <webuijsf:hyperlink actionExpression="#{LabelBean.showExampleIndex}" text="#{msgs.exampleTitle}"
                onMouseOver="javascript:window.status='#{msgs.index_breadcrumbMouseOver}'; return true;"
                onMouseOut="javascript: window.status=''; return true" />
              <webuijsf:hyperlink text="#{msgs.label_title}"/>
            </webuijsf:breadcrumbs>

            <!-- Alert -->
            <webuijsf:markup tag="div" styleClass="#{themeStyles.CONTENT_MARGIN}">
              <br/><webuijsf:messageGroup showDetail="false" rendered="#{LabelBean.messageGroupRendered}"/>
            </webuijsf:markup>

            <webuijsf:alert id="Alert"                
              summary="#{msgs.label_genericError}"
              type="error"               
              rendered="#{LabelBean.alertRendered}" >
            </webuijsf:alert>
                       
            <!-- Page Title -->
            <webuijsf:contentPageTitle title="#{msgs.label_title}">
              <f:facet name="pageHelp">
                <webuijsf:helpInline id="inlinePageHelpText" type="page"
                  text="#{msgs.label_pageHelp}">
                             
                  <!-- JavaHelp helpset for the full example app not available yet
                       so we can't use webuijsf:helpWindow.  Instead, we use a hyperlink
                       to a popup window.
                  <webuijsf:helpWindow id="pageHelpLink" windowTitle="#{msgs.help_windowTitle}"
                    pageTitle="#{msgs.label_title}"
                    mastheadImageUrl="/images/example_primary_masthead.png"
                    mastheadImageDescription="help_mastheadAltText"           
                    toolTip="#{msgs.help_tooltip}"
                    helpFile="label.html"
                    linkIcon="true"
                    linkText="#{msgs.label_morePageHelp}" />
                  -->
                  <webuijsf:imageHyperlink id="pageHelpLink2"
                    icon="HREF_LINK"
                    target="help_window"
                    url="Help.jsp"
                    toolTip="#{msgs.label_helpTooltip}"
                    text="#{msgs.label_morePageHelp}"
                    onMouseOver="javascript:window.status='#{msgs.label_helpTooltip  }'; return true;"
                    onMouseOut="javascript: window.status=''; return true"
                    onClick="javascript: var win = window.open('','help_window','height=500,width=750,top='+((screen.height-(screen.height/1.618))-(500/2))+',left='+((screen.width-650)/2)+',resizable'); win.focus();"/>
                </webuijsf:helpInline>
              </f:facet>
            </webuijsf:contentPageTitle>
                       
            <br/>
                       
            <webuijsf:markup tag="div" styleClass="#{themeStyles.CONTENT_MARGIN}">
              <webuijsf:legend id="legend" text="#{msgs.label_requiredLabel}" />
              <webuijsf:label id="pizzaLabel" text="#{msgs.label_pizza}" labelLevel="1"/>
                         
              <!-- Veggie toppings -->
              <br/><br/>
              <webuijsf:label id="veggieLabel" text="#{msgs.label_veggie}" labelLevel="2"
                style="padding-left:10px;"/>
              <br/>
              <webuijsf:checkbox id="oliveTopping" label="#{msgs.label_olives}"
                selected="#{LabelBean.oliveSelected}" style="padding-left:20px;" 
                validatorExpression="#{LabelBean.oliveValidator}"/>
              <br/>
              <webuijsf:checkbox id="mushroomTopping" label="#{msgs.label_mushrooms}"
                selected="#{LabelBean.mushroomSelected}" style="padding-left:20px;"
                validatorExpression="#{LabelBean.mushroomValidator}"/>
              <br/>
                           
              <!-- Meat toppings -->
              <br/><br/>
              <webuijsf:label id="meatLabel" text="#{msgs.label_meat}" labelLevel="2"
                style="padding-left:10px;"/>
              <br/>
              <webuijsf:checkbox id="pepperoniTopping" label="#{msgs.label_pepperoni}"
                selected="#{LabelBean.pepperoniSelected}" style="padding-left:20px;"
                validatorExpression="#{LabelBean.pepperoniValidator}"/>
              <br/>
              <webuijsf:checkbox id="sausageTopping" label="#{msgs.label_sausage}"
                selected="#{LabelBean.sausageSelected}" style="padding-left:20px;" 
                validatorExpression="#{LabelBean.sausageValidator}"/>
              <br/>
              <webuijsf:checkbox id="anchovieTopping" label="#{LabelBean.anchovieLabel}"
                selected="#{LabelBean.anchovieSelected}" style="padding-left:20px;" 
                validatorExpression="#{LabelBean.anchovieValidator}"/>
              
              <br/><br/><br/>
                         
              <!-- Labeled text input fields -->
              <!-- Use HTML table for layout.  Note that if we had included this
                   content within the body of contentPageTitle, then we would need
                   to wrap the HTML markup in the f:verbatim tag.  webuijsf:markup could
                   also be used but that is more heavyweight (slower). -->
              <table border="0">
              
                <!-- Phone number -->
                <tr>
                  <td valign="top">
                    <webuijsf:label id="phoneLabel" requiredIndicator="true" for="phoneNum"
                      style="padding-right:10px;"
                      toolTip="#{msgs.label_phoneTooltip}"
                      text="#{msgs.label_phoneNumber}"/>
                  </td>
                  <td>
                    <webuijsf:textField id="phoneNum" required="true"
                      text="#{LabelBean.phone}"
                      toolTip="#{msgs.label_phoneTooltip}"
                      validatorExpression="#{LabelBean.phoneValidator}"/>
                  </td>
                </tr>
                
                <!-- 1 blank row.  Note that nbsp must be wrapped in f:verbatim -->
                <tr><td colspan="2"><f:verbatim><![CDATA[ &nbsp; ]]></f:verbatim></td></tr>
                
                <!-- Delivery address -->
                <tr>
                  <td valign="top">
                    <webuijsf:label id="addressLabel" requiredIndicator="true" for="address"
                      style="padding-right:10px;"
                      toolTip="#{msgs.label_addressTooltip}"
                      text="#{msgs.label_address}"/>
                  </td>
                  <td>
                    <webuijsf:textArea id="address" required="true" columns="25" rows="2" 
                      text="#{LabelBean.address}"
                      toolTip="#{msgs.label_addressTooltip}"
                      validatorExpression="#{LabelBean.addressValidator}"/>
                  </td>
                </tr>
              </table>

              <br/><br/>
              
              <!-- Reset button is immediate because we want to bypass data validation and
                   do not want the data to propagate to our model. -->
              <webuijsf:button id="ResetButton" text="#{msgs.label_resetButton}" immediate="true" 
                 actionListenerExpression="#{LabelBean.resetActionListener}" />
                 
              <!-- Order button is NOT immediate because we want to submit the page and
                   and perform data validation.  If all data is valid, we want the model
                   updated. -->
              <webuijsf:button id="OrderButton" text="#{msgs.label_orderButton}" 
                 actionExpression="#{LabelBean.placeOrder}"/>
                           
            </webuijsf:markup>
          </webuijsf:form>
        </webuijsf:body> 
      </webuijsf:html>  
    </webuijsf:page>
  </f:view>
</jsp:root>                       
